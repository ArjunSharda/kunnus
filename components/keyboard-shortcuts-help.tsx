export default function KeyboardShortcutsHelp() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">Search</div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            Ctrl
          </kbd>
          <span className="mx-1">+</span>
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            F
          </kbd>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">View All Grants</div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            Ctrl
          </kbd>
          <span className="mx-1">+</span>
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            A
          </kbd>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">View Bookmarks</div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            Ctrl
          </kbd>
          <span className="mx-1">+</span>
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            B
          </kbd>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">Toggle Dark Mode</div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            Ctrl
          </kbd>
          <span className="mx-1">+</span>
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            D
          </kbd>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">Show Keyboard Shortcuts</div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            Ctrl
          </kbd>
          <span className="mx-1">+</span>
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            /
          </kbd>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        Note: On Mac, use{" "}
        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          ⌘
        </kbd>{" "}
        instead of{" "}
        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          Ctrl
        </kbd>
      </p>
    </div>
  )
}

