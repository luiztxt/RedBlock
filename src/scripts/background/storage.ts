namespace RedBlock.Background.Storage {
  type StorageObject = browser.storage.StorageObject
  export async function loadUsers(): Promise<TwitterUserMap> {
    const { savedUsers } = await browser.storage.local.get<StorageObject & RedBlockStorage>('savedUsers')
    if (savedUsers) {
      return TwitterUserMap.fromUsersArray(savedUsers)
    } else {
      return new TwitterUserMap()
    }
  }
  export async function saveUsers(usersMap: TwitterUserMap): Promise<void> {
    const storeObject: RedBlockStorage = {
      savedUsers: usersMap.toUserArray(),
    }
    // @ts-ignore
    return browser.storage.local.set(storeObject)
  }
  export async function insertSingleUserAndSave(user: TwitterUser): Promise<void> {
    const users = await loadUsers()
    users.addUser(user)
    return saveUsers(users)
  }
  export async function removeSingleUserAndSave(user: TwitterUser): Promise<void> {
    const users = await loadUsers()
    users.delete(user.id_str)
    return saveUsers(users)
  }
}