import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function ensureClient() {
  if (!client.isOpen) {
    await client.connect();
  }
}

// ============ 需求相关 ============

export async function getRequests() {
  await ensureClient();
  const data = await client.get('requests');
  return data ? JSON.parse(data) : [];
}

export async function getRequestById(id: string) {
  const requests = await getRequests();
  return requests.find((r: any) => r.id === id);
}

export async function addRequest(request: any) {
  const requests = await getRequests();
  const newId = String(Date.now());
  const newRequest = {
    id: newId,
    ...request,
    votes: 0,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0]
  };
  requests.push(newRequest);
  await client.set('requests', JSON.stringify(requests));
  return newRequest;
}

export async function voteRequest(id: string) {
  const requests = await getRequests();
  const request = requests.find((r: any) => r.id === id);
  if (request) {
    request.votes += 1;
    await client.set('requests', JSON.stringify(requests));
    return request;
  }
  return null;
}

// ============ 产品相关 ============

export async function getProducts() {
  await ensureClient();
  const data = await client.get('products');
  return data ? JSON.parse(data) : [];
}

export async function getProductById(id: string) {
  const products = await getProducts();
  return products.find((p: any) => p.id === id);
}

export async function addProduct(product: any) {
  const products = await getProducts();
  const newId = String(Date.now());
  const newProduct = {
    id: newId,
    ...product,
    downloads: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };
  products.push(newProduct);
  await client.set('products', JSON.stringify(products));
  return newProduct;
}

// ============ 统计 ============

export async function getStats() {
  const requests = await getRequests();
  const products = await getProducts();
  return {
    totalRequests: requests.length,
    completedProducts: products.filter((p: any) => p.status === 'completed').length,
    totalDownloads: products.reduce((sum: number, p: any) => sum + (p.downloads || 0), 0)
  };
}
