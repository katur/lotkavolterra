import logging
import random
from enum import Enum

from coins import flip_coin, Flip


GROWTH_RATE = 0.333
COMPETITIVE_COIN_WEIGHT = 0.667


class Group(Enum):
    HERD, PACK, COLONY = range(3)


def change_group_if_colony(x):
    if not x.is_colony():
        return False

    x.set_group(random.choice([Group.PACK, Group.HERD]))

    return True


def compete(pack, herd):
    f = flip_coin(weight=COMPETITIVE_COIN_WEIGHT)

    if f == Flip.HEADS:
        pack.increase_size(GROWTH_RATE)
        herd.decrease_size(GROWTH_RATE)
        logging.debug('\tHEADS; pack {} beats herd {}'.format(pack, herd))

    else:
        pack.decrease_size(GROWTH_RATE)
        herd.increase_size(GROWTH_RATE)
        logging.debug('\tTAILS; herd {} beats pack {}'.format(herd, pack))


def interact(x, y):
    logging.debug('{} and {} now interacting'.format(x, y))

    # If a or b is a colony, set temporarily to a pack or herd
    x_was_colony = change_group_if_colony(x)
    y_was_colony = change_group_if_colony(y)

    if x_was_colony:
        logging.debug('\tColony {} acting as {}'.format(x, x.group.name))
    if y_was_colony:
        logging.debug('\tColony {} acting as {}'.format(y, y.group.name))

    # Now the interaction falls into 4 cases
    if x.is_herd() and y.is_herd():
        logging.debug('\t{} and {} both herds, so grow'.format(x, y))
        x.increase_size(GROWTH_RATE)
        y.increase_size(GROWTH_RATE)

    elif x.is_pack() and y.is_pack():
        logging.debug('\t{} and {} both packs, so decline'.format(x, y))
        x.decrease_size(GROWTH_RATE)
        y.decrease_size(GROWTH_RATE)

    elif x.is_pack():
        compete(pack=x, herd=y)

    else:
        compete(pack=y, herd=x)

    logging.debug('\tx size now {}, y size now {}'
                  .format(x.get_size(), y.get_size()))

    # Set colonies back
    if x_was_colony:
        x.set_group(Group.COLONY)

    if y_was_colony:
        y.set_group(Group.COLONY)
