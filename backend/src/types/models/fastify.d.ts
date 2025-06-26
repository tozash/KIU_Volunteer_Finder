import 'fastify'
import { Firestore } from 'firebase-admin/firestore'

declare module 'fastify' {
  interface FastifyInstance {
    db: Firestore
  }

  interface FastifyRequest {
    uid?: string
  }
}