import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

// 确保 data 目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 读取 JSON 文件
function readJSON(filename: string) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// 写入 JSON 文件
function writeJSON(filename: string, data: any) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ============ 需求相关 ============

export function getRequests() {
  return readJSON('requests.json');
}

export function getRequestById(id: string) {
  const requests = getRequests();
  return requests.find((r: any) => r.id === id);
}

export function addRequest(request: any) {
  const requests = getRequests();
  const newId = String(Date.now());
  const newRequest = {
    id: newId,
    ...request,
    votes: 0,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0]
  };
  requests.push(newRequest);
  writeJSON('requests.json', requests);
  return newRequest;
}

export function voteRequest(id: string) {
  const requests = getRequests();
  const request = requests.find((r: any) => r.id === id);
  if (request) {
    request.votes += 1;
    writeJSON('requests.json', requests);
    return request;
  }
  return null;
}

// ============ 产品相关 ============

export function getProducts() {
  return readJSON('products.json');
}

export function getProductById(id: string) {
  const products = getProducts();
  return products.find((p: any) => p.id === id);
}

export function addProduct(product: any) {
  const products = getProducts();
  const newId = String(Date.now());
  const newProduct = {
    id: newId,
    ...product,
    downloads: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };
  products.push(newProduct);
  writeJSON('products.json', products);
  return newProduct;
}

// ============ 统计 ============

export function getStats() {
  const requests = getRequests();
  const products = getProducts();
  return {
    totalRequests: requests.length,
    completedProducts: products.length,
    totalDownloads: products.reduce((sum: number, p: any) => sum + (p.downloads || 0), 0)
  };
}
