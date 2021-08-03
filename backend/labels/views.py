from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
# @login_required(login_url='/login')
from labels.models import User_Label, Video, Label_types
from .models import Label
from .serializers import Lebel_serializer, Reaction_serializer, Lebel_type_serializer


class Labels(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        lebel = Label.objects.all()
        print("thes are labels", lebel)
        lebel_serializer = Lebel_serializer(lebel, many=True).data
        return JsonResponse(lebel_serializer, safe=False)


class finishReaction(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        user_id = request.user
        video_id = data.get('video_id')
        finish_flg = data.get('finish_flg')
        print(finish_flg)
        try:
            reaction = User_Label.objects.filter(
                user_id=user_id, video_id=video_id).update(finish_flg=finish_flg)
            print(reaction)
            return JsonResponse({"error": ""}, safe=False)
        except:
            return JsonResponse({"error": "Error"}, safe=False)

    def put(self, request):
        data = request.data
        user_id = request.user
        id = data.get('id')
        label_id = data.get('label_id')
        type_id = data.get('type_id')
        video_id = data.get('video_id')
        try:
            User_Label.objects.get(
                lebels_id=label_id, type_id=type_id, user_id=user_id, video_id=video_id)
            return JsonResponse({"error": "Same Label"})
        except:
            try:
                reaction = User_Label.objects.filter(id=id).update(
                    lebels_id=label_id, type_id=type_id)
                # reaction.save()
                return JsonResponse({"error": ""}, safe=False)
            except:
                return JsonResponse({"error": "Error"}, safe=False)


class User_reactions(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request):
        data = request.data
        user_id = request.user.id
        video_id = data.get('video_id')
        print(video_id)
        lebel_id = data.get('lebel_id')
        type = data.get('type')
        try:
            reaction = User_Label.objects.get(
                user_id=user_id, video_id=video_id, lebels_id=lebel_id, type_id=type)
            reaction.delete()
            return JsonResponse("deleted", safe=False)
        except:
            return JsonResponse("No data found", safe=False)

    def get(self, request):
        videos = []
        final_videos_to_show = []
        user_id = request.user.id
        username = request.user.username
        video = Video.objects.filter(show_to__username=username)
        for i in video:
            videos.append(i.id)

        get_reactions = User_Label.objects.filter(user_id=user_id)
        for i in get_reactions:
            if i.video_id in videos:
                final_videos_to_show.append(i)
        print("these are reactions", get_reactions)
        serializer = Reaction_serializer(final_videos_to_show, many=True).data
        return JsonResponse(serializer, safe=False)

    def post(self, request):
        data = request.data
        user_id = request.user.id
        video_id = data.get('video_id')
        lebel_id = request.data.get('lebel_id')
        type_id = data.get('type_id')
        startTime = data.get('startTime')
        endTime = data.get('endTime')
        check_label_valid = Label.objects.filter(id=lebel_id, type_id=type_id)
        if check_label_valid:
            username = request.user.username
            if Video.objects.filter(id=video_id, show_to__username=username):
                user_model = User_Label(user_id=user_id, video_id=video_id, lebels_id=lebel_id, type_id=type_id,
                                        startTime=startTime, endTime=endTime, finish_flg=0)
                try:
                    User_Label.objects.get(
                        user_id=user_id, video_id=video_id, lebels_id=lebel_id, type_id=type_id)
                    return JsonResponse("data already exists", safe=False)
                except:
                    user_model.save()
                    return JsonResponse("data saved", safe=False)
            else:
                return JsonResponse("Sorry you can't put a label to a video that is not assigned to you", safe=False)
        else:
            return JsonResponse("This Type is not supported for this label ", safe=False)

    def put(self, request):
        data = request.data
        id = data.get('id')
        startTime = data.get('startTime')
        endTime = data.get('endTime')
        t = User_Label.objects.get(id=id)
        t.startTime = startTime
        t.endTime = endTime
        t.save()
        return JsonResponse("data saved", safe=False)


class Label_types_view(APIView):
    def get(self, request):
        types = Label_types.objects.all()
        print("this are types", types)
        serializer = Lebel_type_serializer(types, many=True).data
        return JsonResponse(serializer, safe=False)
