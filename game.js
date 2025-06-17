import random
import mysql
import mysql.connector

#connecting mysql
my_con=mysql.connector.connect(host="localhost",user="root",passwd="1234",database="Ludo")
if my_con.is_connected():
    cur=my_con.cursor()

#number of simulations
simul = 10000

# datapoints needed for analysis
squares = 13         #number of squares per side
pieces = 4           #the number of tokens per player
turns_to_finish = 0
winner = ""
no_of_captures = 0

#player tokens
player_positions = {
    'player1': [0 for _ in range(pieces)],
    'player2': [0 for _ in range(pieces)]
}

# Home Score for each token
HOME_SCORE = 56

#safe scores
safe_scores =  [0, 8, 13, 21, 26, 34, 39, 47, 51, 52, 53, 54, 55, 56]

'''player 1 scores wrt player 2 so that we can initiate killing
here the key is the score of player 1 and the value is the score of player2'''
kill_scores = {
    27: 1, 28: 2, 29: 3, 30: 4, 31: 5, 32: 6, 33: 7,
    35: 9, 36: 10, 37: 11, 38: 12, 40: 14, 41: 15,
    42: 16, 43: 17, 44: 18, 45: 19, 46: 20, 48: 22,
    49: 23, 50: 24, 1: 27, 2: 28, 3: 29, 4: 30, 5: 31,
    6: 32, 7: 33, 9: 35, 10: 36, 11: 37, 12: 38, 14: 40,
    15: 41, 16: 42, 17: 43, 18: 44, 19: 45, 20: 46, 22: 48,
    23: 49, 24: 50
}

# an array to keep track of the pieces reaching home
player1_homePieces = 0
player2_homePieces = 0

# a variable to count the number of active pieces for Player1 and Player2
active_player1 = len(player_positions['player1']) - player_positions['player1'].count(0)
active_player2 = len(player_positions['player2']) - player_positions['player2'].count(0)

#dice rolling function
def dice_roll():
    return [random.randint(1, 6) for _ in range(3)]


# function to determine whether a piece is safe or not
def is_safe(pos, player):
    return pos in safe_scores or player_positions[player].count(pos) > 1


# randomly selecting a token
def select_token(player):
    # Randomly select from unfinished tokens
    unfinished = [idx for idx in range(pieces) if player_positions[player][idx] < HOME_SCORE]
    return random.choice(unfinished) if unfinished else 0

# function to capture a token
def capture_tks(new_score, player):
    global no_of_captures

    opponent = 'player2' if player == 'player1' else 'player1'
    captured = False
    mapped_score = kill_scores.get(new_score)

    for i in range(pieces):
        opp_score = player_positions[opponent][i]
        if mapped_score == opp_score and not is_safe(opp_score, opponent):
            player_positions[opponent][i] = 0
            captured = True
            no_of_captures += 1

    return captured, player_positions[opponent][:]

# token score update function
def update_score(player, token_id, dice_val):
    current_score = player_positions[player][token_id]  # checking the score of the selected token

    if current_score == HOME_SCORE:  # if already finished then it prevents the token to move again
        return current_score

    # updating the score
    new_score = current_score + dice_val

    # checking if the token after the dice roll has reached home or beyond it
    if new_score >= HOME_SCORE:
        player_positions[player][token_id] = HOME_SCORE
        return HOME_SCORE

    #updating position or score
    player_positions[player][token_id] = new_score
    return new_score


# player1 ( aggressive )
def aggressive(dice_vals):
    global player1_homePieces

    dice_vals.sort(reverse=True)  # Prioritize higher rolls
    for dice_val in dice_vals:
        for idx, pos in enumerate(player_positions['player1']):
        # for promotion
            if (0 < pos < HOME_SCORE) and (pos + dice_val >= HOME_SCORE):
                update_score('player1', idx, dice_val)
                player1_homePieces += 1
                return

        # for capturing moves
            if 0 < pos < HOME_SCORE:
                new_pos = pos + dice_val
                mapped_score = kill_scores.get(new_pos)
                opponent_positions = player_positions['player2']
                if mapped_score in opponent_positions and not is_safe(mapped_score, 'player2'):
                    new_score = update_score('player1', idx, dice_val)
                    capture_tks(new_score, 'player1')
                    return

        # (c) move to safe square
            if 0 < pos < HOME_SCORE:
                new_pos = pos + dice_val
                if new_pos in safe_scores:
                    update_score('player1', idx, dice_val)
                    return

        # (d) first active token with the highest dice roll
            if 0 < pos < HOME_SCORE:
                update_score('player1', idx, dice_val)
                return


# player 2(responsive)

def responsible_pair(dice_vals):
    global player2_homePieces

    dice_vals.sort(reverse=True)  # Use high rolls first

    for dice_val in dice_vals:
        # Get all active tokens
        active_tokens = [i for i, pos in enumerate(player_positions['player2']) if 0 < pos < HOME_SCORE]

        # (a) Promotion
        for token in active_tokens:
            if player_positions['player2'][token] + dice_val >= HOME_SCORE:
                update_score('player2', token, dice_val)
                player1_homePieces += 1
                return

        # (b) Capture
        for token in active_tokens:
            new_pos = player_positions['player1'][token] + dice_val
            mapped = kill_scores.get(new_pos)
            if mapped in player_positions['player2'] and not is_safe(mapped, 'player2'):
                new_score = update_score('player1', token, dice_val)
                capture_tks(new_score, 'player1')
                return

        # (c) Situational Aggression
        if any(pos >= 50 for pos in player_positions['player2']):
            highest_token = max(active_tokens, key=lambda i: player_positions['player1'][i])
            update_score('player1', highest_token, dice_val)
            return

        # (d) Move to Safe Square
        for token in active_tokens:
            if player_positions['player1'][token] + dice_val in safe_scores:
                update_score('player1', token, dice_val)
                return

        # (e) Chase opponent using last 2 tokens
        if len(active_tokens) >= 2:
            last_two = sorted(active_tokens, key=lambda i: player_positions['player1'][i])[-2:]
            for token in last_two:
                for opp in player_positions['player2']:
                    if 0 < opp < HOME_SCORE:
                        if abs((player_positions['player1'][token] + dice_val) - opp) <= 6:
                            update_score('player1', token, dice_val)
                            return

        # (f) Pair movement before reaching 27
        pair_tokens = [i for i in active_tokens if player_positions['player1'][i] < 27]
        if len(pair_tokens) >= 2:
            first = min(pair_tokens, key=lambda i: player_positions['player1'][i])
            update_score('player1', first, dice_val)
            return

        # (g) Paired movement after all reached 27
        post_27 = [i for i in active_tokens if player_positions['player1'][i] >= 27]
        if len(post_27) >= 2:
            first = min(post_27, key=lambda i: player_positions['player1'][i])
            update_score('player1', first, dice_val)
            return

        # Default: just move the first active token
        if active_tokens:
            update_score('player1', active_tokens[0], dice_val)
            return




#gameplay function
def play_game():
