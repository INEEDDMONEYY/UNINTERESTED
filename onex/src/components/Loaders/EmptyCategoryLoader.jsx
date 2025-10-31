export default function EmptyCategoryLoader() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-gray-500">
      <div className="animate-pulse text-sm sm:text-base">
        Loading uncategorized posts...
      </div>
    </div>
  );
}
