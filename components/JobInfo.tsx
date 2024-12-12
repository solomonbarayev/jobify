type JobInfoProps = {
  icon: React.ReactNode;
  text: string;
  link?: boolean;
};

const JobInfo = ({ icon, text, link }: JobInfoProps) => {
  return (
    <div className="flex gap-x-2 items-center">
      {icon}
      {!link ? (
        text
      ) : (
        <a href={text} target="_blank" rel="noreferrer" className="hover:underline">
          {text.length > 25 ? `${text.substring(0, 25)}...` : text}
        </a>
      )}
    </div>
  );
};

export default JobInfo;
