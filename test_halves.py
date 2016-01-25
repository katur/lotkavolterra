import logging
from interactions import Group
from models import Table


logging.basicConfig(level=logging.DEBUG)

x = Table(1)
x.insert('alice', Group.PACK, 100)
x.insert('bob', Group.PACK, 100)
x.insert('carol', Group.PACK, 100)
x.insert('django', Group.PACK, 100)
x.insert('erlich', Group.PACK, 100)
x.insert('freddy', Group.HERD, 100)
x.insert('georgia', Group.HERD, 100)
x.insert('heidi', Group.HERD, 100)
x.insert('indigo', Group.HERD, 100)
x.insert('jack', Group.HERD, 100)

logging.debug('Initial state: {}'.format(x.get_seats_as_strings()))

x.all_seats_interact(num_generations=5)

logging.debug('Final state: {}'.format(x.get_seats_as_strings()))
