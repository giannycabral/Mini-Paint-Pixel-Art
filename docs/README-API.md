# 🤖 **GUIA DE CONFIGURAÇÃO DA API GEMINI**

## 📋 **VISÃO GERAL**

O Mini Paint Pixel Art agora possui um sistema seguro para usar a IA do Google Gemini! Você pode configurar sua própria API key diretamente no aplicativo, sem precisar modificar o código.

## 🔐 **SEGURANÇA**

- ✅ **Sua API key nunca é enviada para nossos servidores**
- ✅ **Fica salva apenas no seu navegador (localStorage)**
- ✅ **Você pode removê-la a qualquer momento**
- ✅ **Validação de formato da key implementada**

## 🚀 **COMO CONFIGURAR**

### **Passo 1: Obter sua API Key**
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a key gerada (começa com "AIza...")

### **Passo 2: Configurar no App**
1. Abra o Mini Paint Pixel Art
2. Clique no botão **"API"** (vermelho = não configurado)
3. Cole sua API key no campo
4. Clique em **"Salvar"**
5. O botão ficará verde ✅ quando configurado

### **Passo 3: Usar a IA**
1. Desenhe sua pixel art
2. Clique no botão **"IA"**
3. Aguarde a descrição criativa da sua arte!

## ⌨️ **ATALHOS DE TECLADO**

- `Ctrl + K` : Abrir configurações da API
- `D` : Descrever arte (se API configurada)

## 🎛️ **CONTROLES**

### **Modal de Configuração:**
- **Salvar**: Salva a API key no localStorage
- **Limpar**: Remove a API key salva
- **❌**: Fechar modal

### **Indicadores Visuais:**
- 🔴 **Botão API Vermelho**: API não configurada
- 🟢 **Botão API Verde**: API configurada e pronta
- ⚠️ **Tooltip**: Mostra status da configuração

## 🔧 **TROUBLESHOOTING**

### **"API key inválida"**
- Verifique se a key começa com "AIza"
- Confirme que copiou a key completa
- Tente gerar uma nova key

### **"Erro ao chamar a API"**
- Verifique sua conexão com a internet
- Confirme se sua key está ativa no Google AI Studio
- Verifique se não excedeu o limite de uso

### **Funcionalidade não aparece**
- Atualize a página (F5)
- Verifique se JavaScript está habilitado
- Teste em navegador atualizado

## 💡 **DICAS**

- **Gratuito**: O Google Gemini tem plano gratuito generoso
- **Privacidade**: Suas imagens são processadas pela Google para gerar descrições
- **Qualidade**: Quanto melhor o desenho, melhor a descrição da IA
- **Personalização**: A IA foi treinada para dar descrições criativas e divertidas

## 🌟 **RECURSOS DA IA**

- ✨ **Descrições criativas** da sua pixel art
- 🎭 **Tom divertido** e entusiasmado
- 🎨 **Análise artística** das cores e formas
- 💭 **Interpretações imaginativas** do desenho

---

**📅 Implementado em**: 23 de novembro de 2025  
**🔒 Nível de Segurança**: Máximo (localStorage apenas)  
**🆓 Custo**: Gratuito (dentro dos limites do Google Gemini)