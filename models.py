from enum import Enum
from interactions import Group


class Seat(object):
    def __init__(self, name, group=None, size=None,
                 next_seat=None, previous_seat=None):
        self.name = name
        self.group = group
        self.size = size
        self.next_seat = next_seat
        self.previous_seat = previous_seat

    def get_group(self):
        return self.group

    def set_group(self, group):
        self.group = group

    def is_herd(self):
        return self.get_group() == Group.HERD

    def is_colony(self):
        return self.get_group() == Group.COLONY

    def is_pack(self):
        return self.get_group() == Group.PACK

    def get_size(self):
        return self.size

    def set_size(self, size):
        self.size = size

    def increase_size(self, growth_rate):
        change = int(round(self.size * growth_rate))
        self.size = self.size + change

    def decrease_size(self, growth_rate):
        change = int(round(self.size * growth_rate))
        self.size = self.size - change
        if self.size <= 2:
            self.size = 0

    def get_next(self):
        return self.next_seat

    def get_previous(self):
        return self.previous_seat

    def set_next(self, other):
        self.next_seat = other

    def set_previous(self, other):
        self.previous_seat = other

    def __repr__(self):
        return '{} {} size:{}'.format(self.group.name, self.name,
                                        self.size)

    def __str__(self):
        return self.__repr__()


class Table(object):
    def __init__(self, name, head=None):
        self.name = name
        self.head = head

    def insert(self, name, group=None, size=None):
        new = Seat(name=name, group=group, size=size)

        if not self.head:
            new.set_next(new)
            new.set_previous(new)

        else:
            # Create next pointers
            new.set_next(self.head)
            new.set_previous(self.head.get_previous())

            # Update old pointers
            new.get_next().set_previous(new)
            new.get_previous().set_next(new)

        self.head = new

    def get_number_of_seats(self):
        if not self.head:
            return 0

        count = 1
        current = self.head.get_next()
        while current != self.head:
            count += 1
            current = current.get_next()

        return count

    def get_seats(self):
        seats = []
        if not self.head:
            return seats

        seats.append(self.head)
        current = self.head.get_next()
        while current != self.head:
            seats.append(current)
            current = current.get_next()

        return seats


    def __repr__(self):
        return ('Table {}, {} seats, head is {}'
                .format(self.name, self.get_number_of_seats(), self.head))

    def __str__(self):
        return self.__repr__()
