const PageLabel = ({ title }: { title: string }) => {
  return (
    <div className="mt-2 bg-slate-400 w-36 h-12 rounded-r-lg flex items-center justify-center shadow">
      <div className="text-xl font-bold">{title}</div>
    </div>
  );
};

export default PageLabel;
