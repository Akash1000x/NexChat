import ShareChat from "./share-chat"

export default function TogglePanel() {
  return (
    <div className="fixed top-1.5 right-1.5 z-10 flex items-center gap-1">
      <ShareChat />
    </div>
  )
}
