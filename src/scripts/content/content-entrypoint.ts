function injectScriptToPage(path: string) {
  document.body
    .appendChild(
      Object.assign(document.createElement('script'), {
        src: browser.runtime.getURL(path),
      })
    )
    .remove()
}

function listenExtensionMessages(reactRoot: Element | null) {
  browser.runtime.onMessage.addListener((msgobj: any) => {
    if (!(typeof msgobj === 'object' && 'messageType' in msgobj)) {
      console.debug('unknown msg?', msgobj)
      return
    }
    const msg = msgobj as RBMessageToContent
    if (msg.messageTo !== 'content') {
      return
    }
    switch (msg.messageType) {
      case 'MarkUser':
        if (reactRoot) {
          document.dispatchEvent(
            new CustomEvent<MarkUserParams>('RedBlock->MarkUser', {
              detail: {
                userId: msg.userId,
                verb: msg.verb,
              },
            })
          )
        }
        break
      case 'MarkManyUsersAsBlocked':
        if (reactRoot) {
          document.dispatchEvent(
            new CustomEvent<MarkManyUsersAsBlockedParams>('RedBlock->MarkManyUsersAsBlocked', {
              detail: {
                userIds: msg.userIds,
              },
            })
          )
        }
        break
      case 'Alert':
        window.alert(msg.message)
        break
      case 'ConfirmChainBlock':
        if (window.confirm(msg.confirmMessage)) {
          browser.runtime.sendMessage<RBActions.Start>({
            actionType: 'Start',
            sessionId: msg.sessionId,
          })
        } else {
          browser.runtime.sendMessage<RBActions.Cancel>({
            actionType: 'Cancel',
            sessionId: msg.sessionId,
          })
        }
        break
      case 'ToggleOneClickBlockMode':
        document.body.classList.toggle('redblock-oneclick-block-mode-enabled', msg.enabled)
        break
    }
  })
}

const reactRoot = document.getElementById('react-root')
listenExtensionMessages(reactRoot)

if (reactRoot && location.hostname !== 'tweetdeck.twitter.com') {
  injectScriptToPage('vendor/uuid.js')
  injectScriptToPage('scripts/content/inject.js')
}
