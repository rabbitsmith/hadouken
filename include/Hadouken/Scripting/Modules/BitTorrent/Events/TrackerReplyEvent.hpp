#ifndef HADOUKEN_SCRIPTING_MODULES_BITTORRENT_EVENTS_TRACKERREPLYEVENT_HPP
#define HADOUKEN_SCRIPTING_MODULES_BITTORRENT_EVENTS_TRACKERREPLYEVENT_HPP

#include <Hadouken/Scripting/Modules/BitTorrent/Events/TrackerEvent.hpp>

#include <memory>
#include <string>

namespace Hadouken
{
    namespace BitTorrent
    {
        struct TorrentHandle;
    }

    namespace Scripting
    {
        namespace Modules
        {
            namespace BitTorrent
            {
                namespace Events
                {
                    class TrackerReplyEvent : public TrackerEvent
                    {
                    public:
                        TrackerReplyEvent(std::shared_ptr<Hadouken::BitTorrent::TorrentHandle> handle, std::string url, int numPeers);

                        void push(void* ctx);

                    private:
                        int numPeers_;
                    };
                }
            }
        }
    }
}

#endif
