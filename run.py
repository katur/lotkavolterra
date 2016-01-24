from models import Group, Table


x = Table(1)
x.insert('alice', Group.PACK)
x.insert('bob', Group.COLONY)
x.insert('carol', Group.PACK)
x.insert('django', Group.HERD)
x.insert('erlich', Group.HERD)
print x
print x.get_seats()
