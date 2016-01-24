from interactions import Group
from models import Table


x = Table(1)
x.insert('alice', Group.PACK, 100)
x.insert('bob', Group.COLONY, 100)
x.insert('carol', Group.PACK, 100)
x.insert('django', Group.HERD, 100)
x.insert('erlich', Group.HERD, 100)

print x
print x.get_seats()
