// components/live-chat-widget.tsx
'use client';

import { LiveChatWidget, EventHandlerPayload } from '@livechat/widget-react';

export function LiveChatWidgetComponent() {
  function handleNewEvent(event: EventHandlerPayload<'onNewEvent'>) {
    console.log('LiveChatWidget.onNewEvent', event);
  }

  return (
    <LiveChatWidget
      license="19117465"
      visibility="maximized"
      onNewEvent={handleNewEvent}
    />
  );
}
