import random
from enum import Enum


class Flip(Enum):
    HEADS, TAILS = range(2)


def flip_coin(weight=0.5):
    r = random.random()
    if r < weight:
        return Flip.HEADS
    else:
        return Flip.TAILS
