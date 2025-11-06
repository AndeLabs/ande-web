# ANDE Testnet Faucet 💰

Un faucet profesional para la red de prueba ANDE que permite a los desarrolladores obtener tokens ANDE gratuitos para testing.

## 🎯 **Características**

- ✅ **100 ANDE por claim** - Tokens gratuitos para testing
- ⏰ **Cooldown de 24 horas** - Previene abusos
- 📊 **Límite de 3 claims diarios** - Uso justo del sistema
- 🔒 **Rate limiting por IP** - Protección contra bots
- 🌐 **Compatible con MetaMask** - Conecta tu wallet fácilmente
- 📱 **Responsive Design** - Funciona en todos los dispositivos
- ⚡ **API REST** - Integración con otros servicios

## 🚀 **Quick Start**

### **Para Usuarios**

1. Visita: `https://tu-dominio.com/faucet`
2. Conecta tu wallet MetaMask
3. Agrega la red ANDE (automático)
4. Solicita 100 ANDE
5. ¡Listo para testear!

### **Para Desarrolladores**

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ande-labs.git
cd ande-labs/ande-web

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar desarrollo
npm run dev
```

## 🔧 **Configuración**

### **Variables de Entorno Locales**

```env
# Faucet Configuration
FAUCET_PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
FAUCET_ADDRESS=0xAb62b7A7D059d6D90b8021aAbdb8123E089F4E0f

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=6174
NEXT_PUBLIC_RPC_URL=https://rpc.ande.network
NEXT_PUBLIC_EXPLORER_URL=https://explorer.ande.network

# Admin Configuration
NEXT_PUBLIC_ADMIN_ADDRESSES=0xAb62b7A7D059d6D90b8021aAbdb8123E089F4E0f
```

### **Configuración de Red ANDE**

```json
{
  "chainId": "0x181e",
  "chainName": "ANDE Network",
  "rpcUrls": ["https://rpc.ande.network"],
  "nativeCurrency": {
    "name": "ANDE",
    "symbol": "ANDE",
    "decimals": 18
  },
  "blockExplorerUrls": ["https://explorer.ande.network"]
}
```

## 📡 **API Endpoints**

### **POST /api/faucet/claim**
Solicitar tokens del faucet.

```bash
curl -X POST https://tu-dominio.com/api/faucet/claim \
  -H "Content-Type: application/json" \
  -d '{"address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Tokens enviados correctamente",
  "txHash": "0x...",
  "amount": "100000000000000000000"
}
```

### **GET /api/faucet/status**
Verificar estado de claims para una dirección.

```bash
curl https://tu-dominio.com/api/faucet/status?address=0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45
```

**Response:**
```json
{
  "success": true,
  "canClaim": true,
  "claimsToday": 0,
  "maxClaimsPerDay": 3,
  "totalClaims": 5,
  "nextClaimAt": null,
  "cooldownRemaining": 0
}
```

## 🏗️ **Arquitectura**

```
src/
├── components/
│   └── faucet/
│       └── simple-faucet.tsx    # Componente principal del faucet
├── app/
│   └── api/
│       └── faucet/
│           ├── claim/route.ts   # API para solicitar tokens
│           └── status/route.ts  # API para verificar estado
└── packages/
    └── blockchain/
        └── config/
            └── wagmi.ts         # Configuración de Web3
```

## 🔒 **Seguridad**

- ✅ Validación de direcciones Ethereum
- ✅ Rate limiting por IP (10 requests/hora)
- ✅ Cooldown por dirección (24 horas)
- ✅ Límite diario (3 claims/día)
- ✅ Private key segura en variables de entorno
- ✅ Validación de inputs del usuario

## 🌐 **Deploy**

### **Vercel**

1. **Variables de Entorno:**
   ```
   FAUCET_PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
   FAUCET_ADDRESS=0xAb62b7A7D059d6D90b8021aAbdb8123E089F4E0f
   NEXT_PUBLIC_CHAIN_ID=6174
   NEXT_PUBLIC_RPC_URL=https://rpc.ande.network
   NEXT_PUBLIC_EXPLORER_URL=https://explorer.ande.network
   ```

2. **Build Command:** `npm run build`
3. **Output Directory:** `.next`
4. **Install Command:** `npm install`

### **GitHub Actions**

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📊 **Monitoreo**

### **Métricas Clave**

- 📈 **Total de claims:** Número total de distribuciones
- 💧 **Saldo actual:** Tokens disponibles en el faucet
- 👥 **Usuarios activos:** Direcciones únicas que han usado el faucet
- 🚫 **IPs bloqueadas:** Direcciones IP con comportamiento sospechoso

### **Alertas**

Configura alertas para:
- 🔴 **Faucet vacío:** Saldo < 100 ANDE
- 🟡 **Bajo saldo:** Saldo < 1000 ANDE
- 📊 **High usage:** >100 claims/hora
- 🚨 **Anomalías:** Patrones sospechosos de uso

## 🛠️ **Troubleshooting**

### **Problemas Comunes**

**❌ "Invalid Ethereum address"**
- Verifica que la dirección comience con `0x`
- Asegúrate de que tenga 42 caracteres
- Usa direcciones checksumeadas

**❌ "Rate limit exceeded"**
- Espera 1 minuto entre intentos
- Cambia de IP si es necesario
- Verifica que no seas un bot

**❌ "Cooldown active"**
- Espera 24 horas desde el último claim
- Verifica el tiempo restante en el status

**❌ "Faucet empty"**
- Contacta al administrador
- Recarga el faucet con más tokens

## 🤝 **Contribuir**

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

## 📄 **Licencia**

MIT License - Ver archivo [LICENSE](LICENSE) para detalles

## 📞 **Soporte**

- 📧 **Email:** support@ande.network
- 💬 **Discord:** [Ande Network Discord](https://discord.gg/ande)
- 🐦 **Twitter:** [@AndeNetwork](https://twitter.com/AndeNetwork)
- 📚 **Docs:** [docs.ande.network](https://docs.ande.network)

---

**⚠️ Importante:** Este faucet es solo para la red de prueba ANDE. Los tokens no tienen valor real y solo deben usarse para desarrollo y testing.

**🚀 Build with ❤️ by Ande Network Team**
```

## 🚀 **Variables de Entorno para Vercel**

Aquí están todas las variables que necesitas configurar en Vercel:

### **1. Variables Requeridas (Production)**

```env
# 🔑 Private Key (NO PÚBLICA)
FAUCET_PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

# 🏠 Faucet Address
FAUCET_ADDRESS=0xAb62b7A7D059d6D90b8021aAbdb8123E089F4E0f

# 🌐 Network Configuration
NEXT_PUBLIC_CHAIN_ID=6174
NEXT_PUBLIC_RPC_URL=https://rpc.ande.network
NEXT_PUBLIC_EXPLORER_URL=https://explorer.ande.network

# 👑 Admin Addresses (separadas por coma)
NEXT_PUBLIC_ADMIN_ADDRESSES=0xAb62b7A7D059d6D90b8021aAbdb8123E089F4E0f
```

### **2. Variables Opcionales**

```env
# 📊 Monitoring (opcional)
NEXT_PUBLIC_SENTRY_DSN=tu_sentry_dsn_aqui

# 🔔 Discord Webhook (opcional)
FAUCET_DISCORD_WEBHOOK=tu_webhook_url_aqui

# 📈 Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### **3. Configuración en Vercel Dashboard**

1. **Ve a tu proyecto en Vercel**
2. **Settings → Environment Variables**
3. **Agrega estas variables:**

| Variable | Value | Environment |
|----------|-------|-------------|
| `FAUCET_PRIVATE_KEY` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` | Production |
| `FAUCET_ADDRESS` | `0xAb62b7A7D059d6D90b8021aAbdb8123E089F4E0f` | Production |
| `NEXT_PUBLIC_CHAIN_ID` | `6174` | Production |
| `NEXT_PUBLIC_RPC_URL` | `https://rpc.ande.network` | Production |
| `NEXT_PUBLIC_EXPLORER_URL` | `https://explorer.ande.network` | Production |
| `NEXT_PUBLIC_ADMIN_ADDRESSES` | `0xAb62b7A7D059d6D90b8021aAbdb8123E089F4E0f` | Production |

### **4. Deploy Commands**

```bash
# Build Command
npm run build

# Output Directory
.next

# Install Command
npm install
```

## 📤 **Subir a GitHub**

```bash
# 1. Agregar archivos al repo
git add .

# 2. Commit inicial
git commit -m "feat: implement ANDE testnet faucet with simple architecture

- ✅ Simple faucet component with MetaMask integration
- ✅ Professional API endpoints with rate limiting
- ✅ 24-hour cooldown and 3 claims/day limits
- ✅ IP-based rate limiting (10 req/hour)
- ✅ Secure private key management
- ✅ Responsive UI with Tailwind CSS
- ✅ Comprehensive documentation
- ✅ Production-ready for Vercel deploy"

# 3. Push a GitHub
git push origin main

# 4. Conectar repo con Vercel (si no lo está)
vercel link

# 5. Deploy
vercel --prod
```

### **Comandos Git para el Deploy:**

```bash
# Si es un nuevo repositorio:
git init
git remote add origin https://github.com/tu-usuario/ande-labs.git

# Para repositorio existente:
git pull origin main
git add .
git commit -m "feat: implement professional ANDE faucet with Vercel deployment"
git push origin main
```

## ✅ **Checklist Pre-Deploy**

- [ ] Variables de entorno configuradas en Vercel
- [ ] Private key segura (no en código)
- [ ] Build exitoso localmente
- [ ] Tests pasando
- [ ] README actualizado
- [ ] Dominio configurado
- [ ] SSL certificate activo
- [ ] Monitoreo configurado

## 🌍 **URLs Finales**

- **Faucet:** `https://tu-dominio.vercel.app/faucet`
- **API:** `https://tu-dominio.vercel.app/api/faucet/claim`
- **Status:** `https://tu-dominio.vercel.app/api/faucet/status`

¡Listo! Con esto tienes un faucet profesional, simple y escalable para la testnet de ANDE. 🚀