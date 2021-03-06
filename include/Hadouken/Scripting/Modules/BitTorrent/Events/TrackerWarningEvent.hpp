#ifndef HADOUKEN_SCRIPTING_MODULES_BITTORRENT_EVENTS_TRACKERWARNINGEVENT_HPP
#define HADOUKEN_SCRIPTING_MODULES_BITTORRENT_EVENTS_TRACKERWARNINGEVENT_HPP

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
                    class TrackerWarningEvent : public TrackerEvent
                    {
                    public:
                        TrackerWarningEvent(std::shared_ptr<Hadouken::BitTorrent::TorrentHandle> handle, std::string url, std::string message);

                        void push(void* ctx);

                    private:
                        std::string message_;
                    };
                }
            }
        }
    }
}

#endif
