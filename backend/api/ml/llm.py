import os
from pathlib import Path
from typing import Final

from huggingface_hub import hf_hub_download
from langchain.llms.llamacpp import LlamaCpp
from langchain.prompts import PromptTemplate

from api.models import Model

MODEL_NAME: Final[str] = os.environ.get('MODEL_NAME', 'Meta-Llama-3-8B-Instruct.Q5_0.gguf')

MODEL_FOLDER: Final[Path] = Path(__file__).parent / 'models'

default_template: str = """
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
This is followed by a description of the bank's client, the product that is supposed to be sold to the client, and an additional prompt describing special circumstances. You need to generate 3 short associations separated by commas so that the client likes them and buys the product. Example: client description - a man over 45 years old with an income of more than 10 million rubles per year, a frequent air traveler; product description - credit card with an extended grace period; additional prompt - New Year's holidays. Associations: passenger plane, skis, credit card. Next, the input parameters will be transmitted, in response correctly, in English, without rearranging the letters, write only the associations themselves, without the word “association” at the beginning.
<|eot_id|>
<|start_header_id|>user<|end_header_id|>{input}<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
"""

__llm: LlamaCpp | None = None
__prompt: PromptTemplate | None = None


def generate_keywords(text: str) -> str:
    chain = __prompt | __llm
    res: str = chain.invoke({'input': text})
    return res


def change_system_promt(system_promt: str):
    global __prompt
    __prompt = PromptTemplate(
        template=system_promt,
        input_variables=["input"]
    )


def init_model(model: Model):
    hf_hub_download(
        repo_id="QuantFactory/Meta-Llama-3-8B-Instruct-GGUF",
        filename=MODEL_NAME,
        local_dir=MODEL_FOLDER.as_posix(),
        local_dir_use_symlinks=False,
    )
    llama_device_id = int(os.environ.get("LLAMA_DEVICE_ID", "1"))
    global __llm
    __llm = LlamaCpp(
        model_path=(MODEL_FOLDER / MODEL_NAME).as_posix(),
        n_gpu_layers=-1,
        model_kwargs={
            "main_gpu": llama_device_id
        }
    )
    global __prompt
    __prompt = PromptTemplate(
        template=model.system_promt,
        input_variables=["input"]
    )
