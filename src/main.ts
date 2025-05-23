type Operation = 'add' | 'remove' | 'group'

type GroupEvent = {
  operation: 'group'
  date: Date
  group: Group
}

type AddOrRemoveEvent = {
  operation: 'add' | 'remove',
  item: string,
  date: Date
}

type Event = GroupEvent | AddOrRemoveEvent

type Group = string[]

export class Inventory {
  private events: Event[] = []

  add(date: Date, item: string) {
    this.events.push({ operation: 'add', item, date })
  }

  remove(date: Date, item: string) {
    this.events.push({ operation: 'remove', item, date })
  }


  group(date: Date, group: Group) {
    this.events.push({ operation: 'group', group, date })
  }

  project(itemsBefore: Date) {
    let itemsPerDate = this.events
      .filter(({ date }) => date.getTime() <= itemsBefore.getTime())


    const added = new Map<string, number>()
    const removed = new Map<string, number>()

    itemsPerDate.forEach((it) => {
      if (it.operation == "remove") {
        const prevCount = removed.get(it.item) ?? 0
        removed.set(it.item, prevCount! + 1)
      }

      if (it.operation === "add") {
        const prevCount = added.get(it.item) ?? 0
        added.set(it.item, prevCount! + 1)
      }
    })

    const items = [...added.entries()]
      .filter(([item, addedCount]) => {
        const removedCount = removed.get(item) ?? 0

        return addedCount > removedCount
      })
      .map(([item]) => item)

    const groupsToApply = itemsPerDate
      .filter(({ operation }) => operation === 'group' ) as GroupEvent[]





  }
}
