# Use a versão mais recente do Node.js (não use "3", pois não é uma versão válida)
FROM node:20

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que o aplicativo usa (3000 no seu caso)
EXPOSE 3000

# Comando para rodar o aplicativo
CMD ["node", "index.js"]