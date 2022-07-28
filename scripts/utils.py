import requests
import json


def fetch(*, url, headers):
    """
    Send a GET request and return response as Python object
    """

    response = requests.get(url, headers=headers)
    return validate_response(response)


class NetworkException(Exception):
    pass


def validate_response(response):
    """
    Validate status code
    Return response as Python object
    """
    if response.status_code >= 400:
        err = f'status_code:{response.status_code} - {response.text}'
        raise NetworkException(err)

    return response.json()

def write_json(*, file, data):
    """
    Write JSON file
    """

    with open(file, 'w') as f:
        json.dump(data, f, indent=2)
