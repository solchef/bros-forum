import { Channel } from '@/lib/types';
import { useEffect, useRef } from 'react';

const Serverchannels = (props: any) => {
  // Explicitly type the containerRef as HTMLDivElement | null
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Use setTimeout to ensure that scrolling happens after the layout is complete
    const timeout = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = containerRef.current.scrollWidth;
      }
    }, 100);

    return () => clearTimeout(timeout); // Cleanup timeout when component is unmounted
  }, [props.filteredChannels]);

  return (
    <div className="fixed mx-2 top-[2.5rem] left-0 w-full bg-custom-dark z-10 py-2">
      {props.selectedServerId && props.filteredChannels?.length ? (
        <div
          ref={containerRef}
          className="overflow-x-auto whitespace-nowrap custom-scrollbar"
        >
          <div className="flex gap-1">
            {props.filteredChannels.map((channel: Channel) => (
              <button
                key={channel.id}
                className="bg-blue-500 text-white text-xs rounded-lg px-2 py-1 hover:bg-blue-600 transition duration-300"
                onClick={() => props.handleChannelClick(channel.id)}
              >
                #{channel.name}
              </button>
            ))}
          </div>
        </div>
      ) : props.selectedServerId && !props.filteredChannels?.length ? (
        <p className="px-4"></p>
      ) : null}
    </div>
  );
};

export default Serverchannels;
