class RequestController:
    @staticmethod
    def validate_request(request_json, required_fields):
        """
        Validates if all the required fields are present in the request json.

        Args:
            request_json (dict): The request json to validate.
            required_fields (list): A list of strings representing the required fields.

        Returns:
            bool: True if all the required fields are present, False otherwise.
        """
        for field in required_fields:
            if field not in request_json:
                print(field + " is missing in the request json.")
                return False
        return True
