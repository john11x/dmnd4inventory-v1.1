import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import  timedelta


fake = Faker()
Faker.seed(42)
np.random.seed(42)
random.seed(42)


N = 1_000_000
NUM_SKUS = 1000
LOCATIONS = ['WH_A', 'WH_B', 'WH_C', 'WH_D']
TRANSACTION_TYPES = ['sale', 'restock', 'damage', 'transfer']


transaction_ids = np.arange(1, N+1)

timestamps = [fake.date_time_between(start_date='-2y', end_date='now') for _ in range(N)]


sku_ids = [f'SKU_{random.randint(1, NUM_SKUS):04d}' for _ in range(N)]


qty_in = np.random.randint(0, 500, size=N)
qty_out = np.random.randint(0, 500, size=N)


current_stock = qty_in - qty_out + np.random.randint(-50, 50, size=N)

batch_ids = [f'BATCH_{random.randint(1, 5000):05d}' if random.random() > 0.02 else None for _ in range(N)]

manufacture_dates = [fake.date_between(start_date='-2y', end_date='today') for _ in range(N)]
expiry_dates = [m + timedelta(days=random.randint(30, 365)) for m in manufacture_dates]

transaction_type = [random.choice(TRANSACTION_TYPES) if random.random() > 0.01 else 'unknown' for _ in range(N)]

locations = [random.choice(LOCATIONS) if random.random() > 0.02 else None for _ in range(N)]

prices = np.round(np.random.uniform(100, 5000, size=N), 2)
prices[np.random.choice(N, size=int(0.005*N), replace=False)] = 0    
prices[np.random.choice(N, size=int(0.005*N), replace=False)] = -50   


df = pd.DataFrame({
    'transaction_id': transaction_ids,
    'timestamp': timestamps,
    'sku_id': sku_ids,
    'qty_in': qty_in,
    'qty_out': qty_out,
    'current_stock': current_stock,
    'batch_id': batch_ids,
    'expiry_date': expiry_dates,
    'manufacture_date': manufacture_dates,
    'transaction_type': transaction_type,
    'location': locations,
    'price': prices
})

df = df.sample(frac=1).reset_index(drop=True)

df.to_csv('data/test_data.csv', index=False)
print(" Master dataset created with 1,000,000 rows!")
