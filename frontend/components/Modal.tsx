export default function Modal({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl max-w-md w-full">
                {children}
                <div className="text-right mt-4">
                    <button onClick={onClose} className="px-3 py-1 rounded-md border">Close</button>
                </div>
            </div>
        </div>
    )
}
