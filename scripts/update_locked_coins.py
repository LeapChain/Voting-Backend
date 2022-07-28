import requests
from utils import fetch, write_json

ACCOUNT_BALANCE_BACKUP_URL = "https://raw.githubusercontent.com/LeapChain/Account-Backups/master/latest_backup/latest.json"
LOCKED_PERCENTAGE = 75


def get_all_account_data():
    return fetch(url=ACCOUNT_BALANCE_BACKUP_URL, headers={})


def divide_balance_to_new_and_locked(balance):
    locked = int(balance * LOCKED_PERCENTAGE / 100)
    new_balance = balance - locked
    return new_balance, locked


all_account_data = get_all_account_data()


def update_account_data_with_locked():

    results = dict()

    for account_number in all_account_data:

        account_data = all_account_data[account_number]
        new_balance, locked_balance = divide_balance_to_new_and_locked(account_data["balance"])

        if account_data["balance"] == 0:
            continue

        results[account_number] = {
            'balance': new_balance,
            'balance_lock': account_number,
            'locked': locked_balance
        }

    return results


def run():

    data = update_account_data_with_locked()
    write_json(file='latest-locked.json', data=data)    

run()
