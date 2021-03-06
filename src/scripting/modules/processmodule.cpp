#include <Hadouken/Scripting/Modules/ProcessModule.hpp>

#include <Poco/Process.h>
#include "../duktape.h"

using namespace Hadouken::Scripting::Modules;

duk_ret_t ProcessModule::initialize(duk_context* ctx)
{
    duk_function_list_entry functions[] =
    {
        { "launch", launch, 2 },
        { NULL,     NULL,   0 }
    };

    duk_put_function_list(ctx, 0, functions);
    return 0;
}

duk_ret_t ProcessModule::launch(duk_context* ctx)
{
    std::string app(duk_require_string(ctx, 0));
    std::vector<std::string> args;

    // get args from 'arguments' property of second param
    if (duk_has_prop_string(ctx, 1, "arguments"))
    {
        duk_get_prop_string(ctx, 1, "arguments");
        duk_enum(ctx, -1, DUK_ENUM_ARRAY_INDICES_ONLY);

        while (duk_next(ctx, -1, 1))
        {
            args.push_back(duk_get_string(ctx, -1));
            duk_pop_2(ctx);
        }

        duk_pop_2(ctx);
    }

    try
    {
        int exitCode = Poco::Process::launch(app, args).wait();
        duk_push_int(ctx, exitCode);
        return 1;
    }
    catch (Poco::Exception& ex)
    {
        // Push error
        duk_error(ctx, DUK_ERR_INTERNAL_ERROR, ex.message().c_str());
    }

    return 0;
}
