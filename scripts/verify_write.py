import json
import os
import time
from gl import make_client, read
from genlayer_py.types import TransactionStatus

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def load_addr():
    dep = os.path.join(ROOT, "deployment.json")
    if os.path.exists(dep):
        return json.load(open(dep, encoding="utf-8"))["contract_address"]
    raise SystemExit("deployment.json not found; deploy first")


ADDR = load_addr()
client, account = make_client()

print("contract:", ADDR)
print("Registering an artifact (deterministic write)...")
tx1 = client.write_contract(
    address=ADDR,
    function_name="register_artifact",
    args=[
        "Mariner's brass octant, c. 1820",
        "A brass-framed octant with ebony scale and ivory vernier, attributed to a London "
        "instrument maker, used aboard a merchant vessel and passed down through four generations.",
    ],
)
print("register tx:", tx1)
client.wait_for_transaction_receipt(transaction_hash=tx1, status=TransactionStatus.ACCEPTED, interval=6000, retries=120)
stats = read(client, account, ADDR, "get_stats")
print("stats after register:", stats)
artifacts = read(client, account, ADDR, "get_artifacts", [0])
aid = artifacts[-1]["id"]
print("artifact id:", aid)

print("Authenticating with provenance evidence (AI write under consensus)...")
tx2 = client.write_contract(
    address=ADDR,
    function_name="authenticate",
    args=[
        aid,
        "Chain of ownership documented by a dated 1971 estate inventory, a 1998 auction-house "
        "catalogue entry with a photograph matching the scale engraving, and a maker's stamp on the "
        "frame consistent with the attributed London workshop's known punches. A conservator's "
        "report notes period-correct patina and original screws with no modern replacements.",
    ],
)
print("authenticate tx:", tx2)
client.wait_for_transaction_receipt(transaction_hash=tx2, status=TransactionStatus.ACCEPTED, interval=8000, retries=120)
time.sleep(3)
print("stats after authenticate:", read(client, account, ADDR, "get_stats"))
print("certified artifact ->", read(client, account, ADDR, "get_artifact", [aid]))
