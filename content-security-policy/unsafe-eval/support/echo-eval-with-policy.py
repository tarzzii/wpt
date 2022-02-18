def main(request, response):
    policy = request.GET.first(b"policy")
    return [(b"Content-Type", b"text/html"), (b"Content-Security-Policy", policy)], b"""
<!DOCTYPE html>
<html>
<script>
var id = 0;
var evalInIframe = "allowed";
try {
  id = eval("id + 1");
} catch (e) {
  if (e instanceof EvalError) {
    if (id === 0)
      evalInIframe = "blocked";
    else
      evalInIframe = "EvalError exception, but eval was executed";
  } else {
    evalInIframe = "Unexpected exception: " + e.message;
  }
}

id = 0;
var evalInParent = "allowed";
try {
  id = parent.eval("1 + 1");
} catch (e) {
  if (e instanceof parent.EvalError) {
    if (id === 0)
      evalInParent = "blocked";
    else
      evalInParent = "EvalError exception, but eval was executed";
  } else {
    evalInParent = "Unexpected exception: " + e.message;
  }
}

window.parent.postMessage({ evalInParent: evalInParent, evalInIframe: evalInIframe});
</script>
</html>
"""
