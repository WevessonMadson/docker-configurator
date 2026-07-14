#!/bin/bash
set -e

echo "Instalando inicialização automática do VRMobileServer..."

docker-compose -f ~/.vr/docker-compose-vrmobileserver.yml down

if ! docker network inspect vr-network >/dev/null 2>&1; then
    docker network create vr-network
fi

docker-compose -f ~/.vr/docker-compose-vrmobileserver.yml up -d

cat > ~/reiniciar_vrmobileserver.sh << 'EOF'
#!/bin/bash

sleep 30

cd ~/.vr/

docker-compose -f docker-compose-vrmobileserver.yml down
docker-compose -f docker-compose-vrmobileserver.yml up -d

#zenity --info --title="VRMobileServer" --text="VR Mobile Server reiniciado com sucesso!"
EOF

chmod +x ~/reiniciar_vrmobileserver.sh

mkdir -p ~/.config/autostart

cat > ~/.config/autostart/vrmobileserver.desktop << EOF
[Desktop Entry]
Type=Application
Version=1.0
Name=VRMobileServer
Comment=Reinicia automaticamente o VRMobileServer
Exec=$HOME/reiniciar_vrmobileserver.sh
Terminal=false
X-GNOME-Autostart-enabled=true
EOF

echo
echo "========================================="
echo "Configuração concluída com sucesso!"
echo "O VRMobileServer será reiniciado"
echo "automaticamente após o login no Ubuntu."
echo "========================================="

echo
echo "Para ver os logs do serviço, execute:"
echo "docker logs -f vr_vrmobileserver_1"
echo "========================================="
