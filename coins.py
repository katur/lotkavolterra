import random
from enum import Enum


class Flip(Enum):
    """The result of a coin flip."""
    HEADS, TAILS = range(2)


def flip_coin(weight=0.5):
    """
    Flip a coin.

    Optionally pass in weight, where weight is the probability of flipping
    Heads. Defaults to a fair coin.
    """
    r = random.random()
    if r < weight:
        return Flip.HEADS
    else:
        return Flip.TAILS
