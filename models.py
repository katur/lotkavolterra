import random
from enum import Enum

from interactions import interact


class Group(Enum):
    """
    An organism group -- herd, pack, or colony.
    """
    HERD, PACK, COLONY = range(3)


class Seat(object):
    """
    A seat at a Table.

    Each seat can be assigned a group (Pack, Herd, Colony) and a
    population size.

    A seat is connected to both adjacent seats, in a double-linked list
    fashion.
    """

    def __init__(self, name, group, population_size,
                 next_seat=None, previous_seat=None):
        self.name = name
        self.group = group
        self.population_size = population_size
        self.next_seat = next_seat
        self.previous_seat = previous_seat

    def __str__(self):
        return '{} {}, size:{}'.format(self.group.name, self.name,
                                       self.population_size)

    def __repr__(self):
        return str(self)

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
        return self.group == Group.HERD

    def is_colony(self):
        return self.group == Group.COLONY

    def is_pack(self):
        return self.group == Group.PACK

    def set_to_colony(self):
        """Set this seat's group to colony."""
        self.group = Group.COLONY

    def set_randomly_to_pack_or_herd(self):
        """Set this seat's group to pack or herd, randomly."""
        self.group = random.choice([Group.PACK, Group.HERD])

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
        """Increase this seat's population size by growth_rate."""
        change = int(round(self.population_size * growth_rate))
        self.population_size = self.population_size + change

    def decrease_population(self, growth_rate):
        """Decrease this seat's population size by growth rate."""
        change = int(round(self.population_size * growth_rate))
        self.population_size = self.population_size - change
        if self.population_size <= 2:
            self.population_size = 0

    def interact_with_next(self):
        """Interact with the next seat."""
        interact(self, self.get_next())


class Table(object):
    """
    A table at the luncheon.

    A table is made up of Seats.
    """
    def __init__(self, name, head=None):
        self.name = name
        self.head = head

    def __str__(self):
        return 'Table {}'.format(self.name)

    def __repr__(self):
        return ('Table {}, {} seats, head is {}'
                .format(self.name, self.get_number_of_seats(), self.head))

    def insert(self, name, group, population_size):
        """Insert a new seat at the head of this table."""
        new = Seat(name=name, group=group,
                   population_size=population_size)

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
        """Get the number of seats at this table."""
        if not self.head:
            return 0

        count = 1
        current = self.head.get_next()
        while current != self.head:
            count += 1
            current = current.get_next()

        return count

    def get_seats(self):
        """Get a list of all seats at this table."""
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
        """Have all seats at this table interact for num_generations."""
        for i in range(num_generations):
            for seat in self.get_seats():
                seat.interact_with_next()
