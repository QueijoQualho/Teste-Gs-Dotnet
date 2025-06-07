# Use a imagem oficial Node.js como base
FROM node:18-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json (se existir) para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install --production

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta que a aplicação vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "testeConsumer.js"]
