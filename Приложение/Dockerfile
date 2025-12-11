#my-dockerfile

# Указываем систему, с которой запускаем
#FROM ubuntu:24.04

# Уберём долгую установку системы и заменим её на установку нужного функционала с официальных сайтов

#-----------------------------------------------------------------------------------------
# СТАДИЯ СБОРКИ БЭКЕНДА
#-----------------------------------------------------------------------------------------

FROM mcr.microsoft.com/dotnet/sdk:6.0  AS backend
 
# QEMU для multi-arch
RUN apt-get update && apt-get install -y qemu-user-static

WORKDIR /app 

# Копируем из исходников в рабочую директорию основной файл C# проекта из бэкенда
COPY src/backend/Backend.csproj ./src/backend/

# Восстановление зависимостей бэкенда
RUN dotnet restore ./src/backend/Backend.csproj

# Компилируем и собираем бэкенд (в папку ./publish)
COPY src/backend/ .
RUN dotnet publish -c Release -o /app/publish


#-----------------------------------------------------------------------------------------
# СТАДИЯ СБОРКИ ФРОНТЕНДА
#-----------------------------------------------------------------------------------------

FROM node:lts-alpine AS frontend

WORKDIR /frontend

# Копируем из исходников в рабочую директорию package.json из фронтенда
COPY src/frontend/package*.json ./

#Устанавиваем зависимости для Реакта.
RUN npm ci

# Копируем код из исходника и собираем фронтенд
COPY src/frontend/ ./

# Собираем фронтенд
RUN npm run build

#------------------------------------------------------------------------------------------------------
# ФИНАЛЬНАЯ СТАДИЯ
#------------------------------------------------------------------------------------------------------

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final

WORKDIR /app 

# Копируем собранный бэкенд из стадии backend-build
COPY --from=backend /app/publish .

# Копируем собранный фронтенд из стадии frontend-build
COPY --from=frontend /frontend/build ./wwwroot

# Ставим порт, через который будем получать доступ к приложению.
ENV ASPNETCORE_URLS=http://0.0.0.0:5000
EXPOSE 5000

# Устанавливаем точку входа.
ENTRYPOINT ["dotnet", "Backend.dll"]


