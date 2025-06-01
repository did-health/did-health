import { useEffect, useState } from 'react'
import ShareModal from 'lit-share-modal-v3'
import 'lit-share-modal-v3/dist/ShareModal.css'

export function SetAccessControl() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setShowModal(true)
  }, [])

  return (
    <>
      <h2 className="text-lg font-semibold">5. Set Access Control</h2>
      {showModal && (
        <ShareModal
          clientShare={() => {}} // handle result of share config here
          injectCSS={false}
          darkMode
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
