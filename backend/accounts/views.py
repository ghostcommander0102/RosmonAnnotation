from django.contrib.auth import login
from django.http import JsonResponse
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer, register_serializer, ChangePasswordSerializer


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        print("entered")
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            if not User.objects.filter(username=username).first():
                return JsonResponse({"error": "No Username"}, safe=False)
            serializer = AuthTokenSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            print("second")
            login(request, user)
            print(LoginAPI)
            print("last")
            print(request)
            return super(LoginAPI, self).post(request, format=None)
        except Exception as e:
            return JsonResponse({"error": "password is incorrect"}, safe=False)


class Register(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        print("hello emaila", email)
        password = request.data.get('password')
        print("this is oass", password)
        confirm_password = request.data.get('confirm_password')
        print("this ids cnfrm ass", confirm_password)
        if password == None or confirm_password == None:
            return JsonResponse({"error": "please enter pass and confirm password"}, safe=False)
        else:
            if password == confirm_password:
                print("this is new password", password)
                try:
                    get_user = User.objects.get(email=email)
                    print("this is the user", get_user)
                    get_user.set_password(password)
                    get_user.save()
                    return JsonResponse({"error": ""}, safe=False)
                except Exception as e:
                    user_model = User(
                        email=email, username=username, password=password)
                    user_model.save()
                    return JsonResponse({"error": "successfully created user"}, safe=False)
            else:
                return JsonResponse({"error": "password and confirm password does not match"}, safe=False)


class Change_Pass(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
            }
            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Get_user_data(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_id = request.user.id
        get_user = User.objects.get(id=user_id)
        user_serializer = UserSerializer(get_user, many=False).data
        return JsonResponse(user_serializer, safe=False)
