import requests

BASE_API_URL = "https://7nfr0m.deta.dev"
LEAPCHAIN_BALANCE_API_URL = "https://raw.githubusercontent.com/LeapChain/Account-Backups/master/account_backups/2022-04-17-15%3A08%3A28.json"
POLL_DURATION = 5


class NetworkException(Exception):
    pass


def fetch(*, url, headers):
    """
    Send a GET request and return response as Python object
    """

    response = requests.get(url, headers=headers)
    return validate_response(response)


def validate_response(response):
    """
    Validate status code
    Return response as Python object
    """
    if response.status_code >= 400:
        err = f'status_code:{response.status_code} - {response.text}'
        raise NetworkException(err)

    return response.json()


def get_all_account_balances():
    return fetch(url=LEAPCHAIN_BALANCE_API_URL, headers={})


account_balances = get_all_account_balances()


def get_account_balance(account_number):
    
    if account_number in account_balances:
        return account_balances[account_number]['balance']
    return 0


def list_active_polls():
    return fetch(url=f"{BASE_API_URL}/api/v1/polls?status=0", headers={})


def list_votes_on_poll(poll_id):
    return fetch(url=f"{BASE_API_URL}/api/v1/polls/{poll_id}", headers={})


def calculate_vote_results():

    active_polls = list_active_polls()

    for poll in active_polls:

        poll_vote_weightage = 0
        choice_vote_weightage = {}
        all_votes_on_poll = list_votes_on_poll(poll['_id'])['votes']

        for vote in all_votes_on_poll:

            voter_account_balance = get_account_balance(vote['accountNumber'])
            poll_vote_weightage += voter_account_balance

            if vote['choices'] in choice_vote_weightage:
                choice_vote_weightage[vote['choices']] += voter_account_balance
            else:
                choice_vote_weightage[vote['choices']] = voter_account_balance

        print(choice_vote_weightage)
        print(poll_vote_weightage)


calculate_vote_results()
