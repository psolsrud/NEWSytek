from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib import auth

# Register your models here.

class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Advanced options', {
            'fields': ('is_active', 'is_superuser'),
        }),
    )
    list_display = ('username', 'last_login', 'date_joined', 'is_active', 'is_superuser')
    list_filter = ('last_login', 'date_joined', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('-last_login',)

admin.site.register(get_user_model(), CustomUserAdmin)
admin.site.unregister(auth.models.Group)