#include <Hadouken/Scripting/Modules/BitTorrent/Events/MetadataFailedEvent.hpp>

#include <Hadouken/BitTorrent/TorrentHandle.hpp>
#include "../../../duktape.h"

using namespace Hadouken::BitTorrent;
using namespace Hadouken::Scripting::Modules::BitTorrent::Events;

MetadataFailedEvent::MetadataFailedEvent(std::shared_ptr<TorrentHandle> handle, Error error)
    : TorrentEvent(handle),
    error_(error)
{
}

void MetadataFailedEvent::push(duk_context* ctx)
{
    duk_idx_t idx = duk_push_object(ctx);
    
    TorrentEvent::push(ctx);
    duk_put_prop_string(ctx, idx, "torrent");

    // ---- error
    duk_idx_t errIdx = duk_push_object(ctx);
    
    duk_push_int(ctx, error_.code);
    duk_put_prop_string(ctx, errIdx, "code");

    duk_push_string(ctx, error_.message.c_str());
    duk_put_prop_string(ctx, errIdx, "message");

    duk_put_prop_string(ctx, idx, "error");
}
