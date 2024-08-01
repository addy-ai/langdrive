# Import ModelCatalog from llmware.models module 
from llmware.models import ModelCatalog

# Define the class LLMWare
class LLMWare:
    """
    Class for handling operations related to LLMWare.
    """

    def __init__(self, model_name: str,
                 temperature: float = 0.0,
                 sample: bool = False,
                 get_logits: bool = False):
        """
        Initialize LLMWare instance with given parameters.

        :param model_name: Name of the model to load
        :param temperature: Temperature parameter for the model (defaults to 0.0)
        :param sample: If set to True, sampling will be enabled (defaults to False)
        :param get_logits: If set to True, logit output will be returned by the model (defaults to False)
        """
        self.model_name = model_name
        self.temperature = temperature
        self.sample = sample
        self.get_logits = get_logits

        # Load the model
        self.model = ModelCatalog().load_model(model_name,
                                               temperature=temperature,
                                               sample=sample,
                                               get_logits=get_logits)

    def extract(self, text: str, attribute: str):
        """
        Extract the attribute value from the provided text using the model.

        :param text: Input text
        :param attribute: Attribute to extract from the text
        :return: Response from the model as a JSON string
        """
        response = self.model.function_call(text, params=[attribute])
        return response["llm_response"]
