from django.contrib.auth.models import User, Group  # type: ignore
from rest_framework import exceptions  # type: ignore
from carts.auth import JwtAuthentication
from carts.carts_api.models import AppUser, State, StatesFromUsername


class JwtDevAuthentication(JwtAuthentication):
    def authenticate(self, request, username=None):
        print("Inside Auth")
        print(username)
        dev_username = username

        try:
            if not dev_username:
                if "dev" in request.query_params:
                    print("inside dev_username")
                    try:
                        dev_username = request.query_params["dev"]
                    except Exception as e:
                        print("exception 1")
                        raise exceptions.AuthenticationFailed(
                            "dev authentication failed"
                        ) from e
        except Exception as e:
            print("exception 2")
            raise exceptions.AuthenticationFailed(
                "dev authentication failed"
            ) from e

        if dev_username:
            _, suffix = dev_username.split("-")
            print("dev_username")
            roles = {
                "admin": "admin_user",
                "bus": "bus_user",
                "co_user": "co_user",
                "ak": "state_user",
                "az": "state_user",
                "ma": "state_user",
            }

            role = roles[suffix]
            print(role)
            if role == "state_user":
                print("state_user")
                state_codes = [suffix.upper()]
                states = State.objects.filter(code__in=state_codes)
                email = f"{dev_username}@{states[0].name.lower()}.gov"
                try:
                    state_relationship = StatesFromUsername.objects.get(
                        username=dev_username
                    )
                    if state_relationship:
                        state_codes = state_relationship.state_codes
                        states = State.objects.filter(code__in=state_codes)
                except StatesFromUsername.DoesNotExist:
                    print("before pass")
                    pass
            else:
                states = []
                email = f"{dev_username}@example.com"

            dev_user, _ = User.objects.get_or_create(
                username=dev_username,
            )
            dev_user.first_name = "DevFirst"
            dev_user.last_name = f"Dev{role}"
            dev_user.email = email
            print("after users")
            if role == "admin_user":
                group = Group.objects.get(name="Admin users")
                dev_user.groups.set([group])
            # Once we have different permissions for co_users, add here.
            elif role in ("bus_user", "co_user"):
                print("75")
                try:
                    group = Group.objects.get(name="Business owner users")
                    print("77")
                    dev_user.groups.set([group])
                    print("79")
                except BaseException as err:
                    print(err)
            elif role == "state_user":
                group = Group.objects.get(
                    name__endswith=f"{state_codes[0]} sections"
                )
                dev_user.groups.set([group])
            print("before app_user")
            app_user, _ = AppUser.objects.get_or_create(user=dev_user)
            app_user.states.set(states)
            app_user.role = role
            app_user.save()

            dev_user.save()

            return (dev_user, None)

        # no username specified in query params, fall back to jwt auth
        return super().authenticate(request)
