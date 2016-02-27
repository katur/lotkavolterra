import random
from enum import Enum

from lotkavolterra.interactions import interact


class Group(Enum):
    """
    An organism group -- herd, pack, or colony.
    """
    herd, pack, colony = range(3)


def get_random_group():
    """
    Get a random group (herd, pack, or colony)
    """
    return random.choice([Group.pack, Group.herd, Group.colony])


class Seat(object):
    """
    A seat at a Table.

    Each seat can be assigned a group (Pack, Herd, Colony) and a
    population size.

    A seat is connected to both adjacent seats, in a double-linked list
    fashion.
    """

    def __init__(self, pk, index, name, group, population_size,
                 table=None, next_seat=None, previous_seat=None):
        self.pk = pk  # Unique identifier across tables
        self.index = index  # Position within the table
        self.name = name
        self.group = group
        self.population_size = population_size
        self.initial_population_size = population_size
        self.table = table
        self.next_seat = next_seat
        self.previous_seat = previous_seat

    def __str__(self):
        return '{} {}'.format(self.group.name, self.name)

    def __repr__(self):
        return '{} {}, size:{}'.format(self.group.name, self.name,
                                       self.population_size)

    def get_next(self):
        """Get the next adjacent seat."""
        return self.next_seat

    def get_previous(self):
        """Get the previous adjacent seat."""
        return self.previous_seat

    def set_next(self, other):
        """Set the next adjacent seat."""
        self.next_seat = other

    def set_previous(self, other):
        """Set the previous adjacent seat."""
        self.previous_seat = other

    def is_herd(self):
        """Determine if this seat is a herd."""
        return self.group == Group.herd

    def is_pack(self):
        """Determine if this seat is a pack."""
        return self.group == Group.pack

    def is_colony(self):
        """Determine if this seat is a colony."""
        return self.group == Group.colony

    def set_to_colony(self):
        """Set this seat's group to colony."""
        self.group = Group.colony

    def set_randomly_to_pack_or_herd(self):
        """Set this seat's group to pack or herd, randomly."""
        self.group = random.choice([Group.pack, Group.herd])

    def change_group_if_colony(self):
        """
        If this seat is a colony, change it randomly to a pack or herd.

        Returns True if this seat was a colony initially (now changed to
        pack or herd).

        Returns False if this seat was not a colony initially (so was not
        changed).
        """
        if not self.is_colony():
            return False

        self.set_randomly_to_pack_or_herd()

        return True

    def increase_population(self, growth_rate):
        """
        Increase this seat's population size by growth_rate.
        """
        change = int(round(self.population_size * growth_rate))
        self.population_size = self.population_size + change

        if self.population_size >= 10 * self.initial_population_size:
            self.population_size = 0

    def decrease_population(self, growth_rate):
        """
        Decrease this seat's population size by growth_rate.
        """
        change = int(round(self.population_size * growth_rate))
        self.population_size = self.population_size - change

        # If, by this growth_rate, further decline is not possible
        if int(round(self.population_size * growth_rate)) == 0:
            self.population_size = 0

    def is_extinct(self):
        """
        Determine if this seat has become extinct.
        """
        return self.population_size == 0

    def get_next_interactor(self):
        """
        Get the next interactor for this seat.

        Returns None if this seat is extinct, or if this seat is the only
        node left.
        """
        if self.is_extinct():
            return None

        interactor = self.get_next()
        while interactor.is_extinct():
            interactor = interactor.get_next()

        if self == interactor:
            return None

        return interactor

    def interact_with_next_interactor(self):
        """
        Interact with the next defined interactor.
        """
        interactor = self.get_next_interactor()
        if interactor:
            interact(self, interactor)

    def export_state(self):
        """
        Export the current state of this seat.
        """
        return {
            'pk': self.pk,
            'index': self.index,
            'name': str(self.name),
            'group': self.group.name,
            'population_size': self.population_size,
            'table_xcoordinate': self.table.xcoordinate,
            'table_ycoordinate': self.table.ycoordinate,
            'table_size': self.table.size,
        }


class Table(object):
    """
    A table of seats.
    """
    def __init__(self, name, xcoordinate=0, ycoordinate=0):
        self.name = name
        self.head = None

        # Position in the space
        self.xcoordinate = xcoordinate
        self.ycoordinate = ycoordinate

        self.size = 0

    def __str__(self):
        return 'Table {}'.format(self.name)

    def __repr__(self):
        return ('Table {}, {} seats, head is {}'
                .format(self.name, self.size, self.head))

    def insert(self, pk, index, name, group, population_size):
        """
        Insert a new seat at the head of this table.
        """
        new_seat = Seat(pk=pk, index=index, name=name, group=group,
                        population_size=population_size, table=self)

        if not self.head:
            new_seat.set_next(new_seat)
            new_seat.set_previous(new_seat)

        else:
            # Create next pointers
            new_seat.set_previous(self.head)
            new_seat.set_next(self.head.get_next())

            # Update old pointers
            new_seat.get_next().set_previous(new_seat)
            new_seat.get_previous().set_next(new_seat)

        self.head = new_seat
        self.size += 1

    def get_all_seats(self):
        """
        Get a list of all seats at this table.
        """
        seats = []
        if not self.head:
            return seats

        seats.append(self.head)
        current = self.head.get_next()
        while current != self.head:
            seats.append(current)
            current = current.get_next()

        return seats

    def all_seats_interact(self, num_generations=1):
        """
        Have all seats at this table interact for num_generations.
        """
        for i in range(num_generations):
            for seat in self.get_all_seats():
                seat.interact_with_next_interactor()

    def export_state(self):
        """
        Export the current state of this table.
        """
        data = {}
        data['seats'] = []

        for seat in self.get_all_seats():
            data['seats'].append(seat.export_state())

        return data

    def export_current_sizes(self):
        """
        Export a mapping from seat pk to population size for all seats
        at this table.
        """
        data = {}
        for seat in self.get_all_seats():
            data[seat.pk] = seat.population_size

        return data
