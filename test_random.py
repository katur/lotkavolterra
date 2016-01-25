import logging
from interactions import Group
from models import Table


logging.basicConfig(level=logging.DEBUG)

x = Table(1)
x.insert('alice', Group.PACK, 100)
x.insert('bob', Group.COLONY, 100)
x.insert('carol', Group.PACK, 100)
x.insert('django', Group.HERD, 100)
x.insert('erlich', Group.HERD, 100)
x.insert('freddy', Group.HERD, 100)
x.insert('georgia', Group.COLONY, 100)
x.insert('heidi', Group.PACK, 100)
x.insert('indigo', Group.COLONY, 100)
x.insert('jack', Group.PACK, 100)

logging.info('Initial state: {}'.format(x.get_seats()))

x.all_seats_interact(num_generations=5)

logging.info('Final state: {}'.format(x.get_seats()))
