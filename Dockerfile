#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs
RUN apt-get install -y npm

FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build

RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs


WORKDIR /src
COPY ["fullstack/fullstack.csproj", "fullstack/"]
RUN dotnet restore "fullstack/fullstack.csproj"
COPY . .
WORKDIR "/src/fullstack"
RUN dotnet build "fullstack.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "fullstack.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "fullstack.dll"]