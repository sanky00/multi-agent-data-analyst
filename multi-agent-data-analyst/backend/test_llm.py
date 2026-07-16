from crew.llm import groq_llm

response = groq_llm.call(
    "Say hello in one sentence."
)

print(response)