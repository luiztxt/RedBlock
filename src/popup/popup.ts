namespace RedBlock.Popup {
  type SessionRequest = RedBlock.Background.ChainBlockSession.SessionRequest
  type Tab = browser.tabs.Tab
  export async function startChainBlock(userName: string, targetList: FollowKind, options: SessionRequest['options']) {
    return browser.runtime.sendMessage<RBActions.Start, void>({
      action: Action.StartChainBlock,
      userName,
      targetList,
      options,
    })
  }

  export async function stopChainBlock(sessionId: string) {
    return browser.runtime.sendMessage<RBActions.Stop>({
      action: Action.StopChainBlock,
      sessionId,
    })
  }

  export async function stopAllChainBlock() {
    return browser.runtime.sendMessage<RBActions.StopAll>({
      action: Action.StopAllChainBlock,
    })
  }

  export async function requestProgress() {
    return browser.runtime.sendMessage<RBActions.RequestProgress>({
      action: Action.RequestProgress,
    })
  }

  export async function insertUserToStorage(user: TwitterUser) {
    return browser.runtime.sendMessage<RBActions.InsertUserToStorage>({
      action: Action.InsertUserToStorage,
      user,
    })
  }

  export async function removeUserFromStorage(user: TwitterUser) {
    return browser.runtime.sendMessage<RBActions.RemoveUserFromStorage>({
      action: Action.RemoveUserFromStorage,
      user,
    })
  }

  export async function getCurrentTab(): Promise<Tab | null> {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })
    const currentTab = tabs[0]
    if (!currentTab || !currentTab.url) {
      return null
    }
    return currentTab
  }

  export function getUserNameFromTab(tab: Tab): string | null {
    if (!tab || !tab.url) {
      return null
    }
    const url = new URL(tab.url)
    return getUserNameFromURL(url)
  }
}