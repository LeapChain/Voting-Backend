import requests
import datetime
import json
import os
from nacl.encoding import HexEncoder
import nacl.signing

from utils import fetch

BASE_API_URL = "https://7nfr0m.deta.dev"
LEAPCHAIN_BALANCE_API_URL = "https://raw.githubusercontent.com/LeapChain/Account-Backups/master/latest_backup/latest.json"
POLL_DURATION = 3  # the runtime of poll in days


def get_all_account_balances():
    return fetch(url=LEAPCHAIN_BALANCE_API_URL, headers={})


account_balances = get_all_account_balances()


def get_account_balance(account_number):
    
    if account_number in account_balances:
        return account_balances[account_number]['balance'] + account_balances[account_number]['locked']
    return 0

def get_user_nonce(account_number):
    body = {
        "accountNumber": account_number
    }
    return requests.post(url=f"{BASE_API_URL}/api/v1/users/create", json=body, headers={}).json()['nonce']


def list_active_polls():
    return fetch(url=f"{BASE_API_URL}/api/v1/polls?status=0", headers={})


def list_votes_on_poll(poll_id):
    return fetch(url=f"{BASE_API_URL}/api/v1/polls/{poll_id}", headers={})


def calculate_vote_results():

    active_polls = list_active_polls()

    for poll in active_polls:

        poll_vote_weightage = 0
        all_votes_on_poll = list_votes_on_poll(poll['_id'])['votes']
        temp_choices = []
        temp_choice_dict = {}
        choices = []
        status = 0

        # initiate the temp_choice_dictionary
        for choice in poll['choices']:
            temp_choice_dict[choice['_id']] = 0

        for vote in all_votes_on_poll:

            voter_account_balance = get_account_balance(vote['accountNumber'])
            poll_vote_weightage += voter_account_balance

            temp_choices.append({
                "_id": vote['choices'],
                "totalVotes": voter_account_balance
                })

        poll_created_at = datetime.datetime.strptime(poll['createdAt'], '%Y-%m-%dT%H:%M:%S.%fZ')
        poll_expiry_date = poll_created_at + datetime.timedelta(days=POLL_DURATION)
        current_date_time = datetime.datetime.now()

        if current_date_time >= poll_expiry_date:
            status = 1

        # merge duplicate choices and add the votes..
        # ignore the votes that were not part of poll choices
        for individual_choice in temp_choices:
            if individual_choice["_id"] in temp_choice_dict:
                temp_choice_dict[individual_choice["_id"]] += individual_choice["totalVotes"]

        # convert the temp_choice_dict to list of choice with values
        for choice in temp_choice_dict:
            choices.append({
                "_id": choice,
                "totalVotes": temp_choice_dict[choice]
            })
        
        # sort the choices by ascending "_id" parameter
        sorted_choices = sorted(choices, key=lambda x: x['_id'])

        # sign the message using private key
        signing_key = nacl.signing.SigningKey(str.encode(os.environ['PRIVATE_KEY']), encoder=nacl.encoding.HexEncoder)
        account_number = signing_key.verify_key.encode(encoder=nacl.encoding.HexEncoder).decode('utf-8')

        message = {
            "choices": sorted_choices,
            "nonce": get_user_nonce(account_number),
            "status": status,
            "voteWeightage": poll_vote_weightage,
        }

        json_message = json.dumps(message, separators=(',', ':'))

        signed_hex = signing_key.sign(str.encode(json_message), encoder=HexEncoder)
        signature = signed_hex.signature.decode('utf-8')

        patch_request_body = {}
        patch_request_body['accountNumber'] = account_number
        patch_request_body['signature'] = signature
        patch_request_body['voteWeightage'] = poll_vote_weightage
        patch_request_body['choices'] = sorted_choices
        patch_request_body['status'] = status
        update_poll = requests.patch(url=f"{BASE_API_URL}/api/v1/polls/{poll['_id']}", json=patch_request_body, headers={}).json()
        print(update_poll)
        print("------------------------------------")

print("Beep, boop; calculating the poll results....")
calculate_vote_results()
print("Beep, boop; poll results updated successfully....")
